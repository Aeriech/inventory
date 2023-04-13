<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Purchase;
use App\Models\Receipt;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Str;

class PurchaseController extends Controller
{
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'purchases.*.name' => 'required',
        'purchases.*.measurement' => 'required|numeric|min:1',
    ]);

    
    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $purchases = $request->input('purchases');
    $savedPurchases = [];
    $latestPurchase = Purchase::latest('purchase_number')->first();
    $newPurchaseNumber = $latestPurchase ? $latestPurchase->purchase_number + 1 : 1;

    foreach ($purchases as $purchaseData) {
        $purchase = new Purchase();
        //$item = Item::where('name', $purchaseData['name'])->first();
        //$purchase->item_id = $item->id;
        $purchase->name = $purchaseData['name'];
        $purchase->measurement = $purchaseData['measurement'];
        $purchase->measured_in = $purchaseData['measurementUnit'];
        $purchase->status = "Pending";
        $purchase->item_id = $purchaseData['item_id'];
        $purchase->price = $purchaseData['item_price'];
        $purchase->purchase_number = $newPurchaseNumber;
        $purchase->save();
        $savedPurchases[] = $purchase;
    }

    return response()->json(['purchases' => $savedPurchases]);
}


public function index()
{
    $purchases = Purchase::orderBy('purchase_number')->get();
    $perPage = 30; // Number of items per page
    $currentPage = request()->input('page', 1); // Get the current page from the request
    $groupedPurchases = $purchases->groupBy('purchase_number');
    $total = count($groupedPurchases);
    $lastPage = ceil($total / $perPage); // Calculate the total number of pages

    // Paginate the grouped purchases
    $groupedPurchases = array_slice($groupedPurchases->toArray(), ($currentPage - 1) * $perPage, $perPage, true);

    // Return the grouped purchases and pagination data as JSON response
    return response()->json([
        'groupedPurchases' => $groupedPurchases,
        'pagination' => [
            'currentPage' => $currentPage,
            'lastPage' => $lastPage,
        ],
    ]);
}

public function approve($id)
{
    $purchases = Purchase::where('purchase_number', $id)->get();
    $savedPurchases = [];

    foreach ($purchases as $purchase) {
        $purchase->status = "Approved";
        $purchase->save();
        $savedPurchases[] = $purchase;
    }

    return response()->json(['purchases' => $savedPurchases]);
}

public function reject($id)
{
    $purchases = Purchase::where('purchase_number', $id)->get();
    $savedPurchases = [];

    foreach ($purchases as $purchase) {
        $purchase->status = "Rejected";
        $purchase->save();
        $savedPurchases[] = $purchase;
    }

    return response()->json(['purchases' => $savedPurchases]);
}

public function getPurchase($purchaseNumber)
{
    $purchases = Purchase::where('purchase_number', $purchaseNumber)->get();

    // Create an empty array to store the retrieved data
    $purchaseData = [];

    // Loop through the $purchases collection to access each record
    foreach ($purchases as $purchase) {
        // Access the data of each record
        $id = $purchase->id;
        $name = $purchase->name;
        $measurement = $purchase->measurement;
        $measured_in = $purchase->measured_in;
        $created_at = $purchase->created_at;
        $item_id = $purchase->item_id;
        $PNumber = $purchase->purchase_number;
        $price = $purchase->price;
        // ... and so on

        // Add the retrieved data to the $purchaseData array
        $purchaseData[] = [
            'id' => $id,
            'name' => $name,
            'measurement' => $measurement,
            'measured_in' => $measured_in,
            'created_at' => $created_at,
            'item_id' => $item_id,
            'purchase_number' => $PNumber,
            'price' => $price,
            // ... and so on
        ];
    }

    // Return the $purchaseData array as JSON
    return response()->json($purchaseData);
}

public function updatePurchases(Request $request)
{
    $validator = Validator::make($request->all(), [
        'updatedPurchases.*.price' => 'required|numeric|min:0',
        'updatedPurchases.*.itemAdded' => 'required|numeric|min:0',
        'receipts.*.amount' => 'required|numeric|min:0',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Retrieve the updated purchase data from the request body
    $updatedPurchases = $request->input('updatedPurchases');

    // Perform logic to update the purchases in the database
foreach ($updatedPurchases as $purchaseData) {
    $item = Item::find($purchaseData['item_id']);
    $purchase = Purchase::find($purchaseData['id']); // Assuming 'id' is the primary key column name
    if ($purchase) {
        // Update the purchase data
        $purchase->price = $purchaseData['price'];
        $purchase->item_added = $purchaseData['itemAdded'];
        $purchase->status = "Completed";
        $item->price = $purchaseData['price'];
        $purchase->purchase_date = Carbon::parse($request->input('selectedDate'))->format('Y-m-d'); // Update with selectedDate value
        $item->measurement = $item->measurement + $purchaseData['itemAdded'];
        // Save the updated purchase to the database
        $item->save();
        $purchase->save();
    }
}


// Process receipts
$receipts = $request->input("receipts");

foreach ($receipts as $receiptData) {
    $receipt = new Receipt();
    if (isset($receiptData['image']) && $receiptData['image']) { // Check if image data exists
        $strpos = strpos($receiptData['image'], ";");
        $sub = substr($receiptData['image'], 0, $strpos);
        $ex = explode('/', $sub)[1];
        $name = time() . "_" . Str::random(10) . "." . $ex; // Use a unique name for each image
        $img = Image::make($receiptData['image'])->resize(500, 500);
        $upload_path = public_path() . "/upload/";
        $img->save($upload_path . $name);
        $photo = $upload_path . $receipt->image;
        $img->save($upload_path . $name);
        if (file_exists($photo)) {
            @unlink($photo);
        }
        $receipt->image = $name;
    }

    $receipt->purchase_number = $updatedPurchases[0]['purchase_number']; // Assuming the purchase number is same for all updated purchases
    $receipt->supplier = $receiptData['supplier'];
    $receipt->description = $receiptData['description'];
    $receipt->amount = $receiptData['amount'];
    $receipt->save(); // Save the receipt to the database
}


}



}