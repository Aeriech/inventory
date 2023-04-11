<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        // ... and so on

        // Add the retrieved data to the $purchaseData array
        $purchaseData[] = [
            'id' => $id,
            'name' => $name,
            'measurement' => $measurement,
            'measured_in' => $measured_in,
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
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }
    // Retrieve the updated purchase data from the request body
    $updatedPurchases = $request->input('updatedPurchases');

    // Perform logic to update the purchases in the database
    foreach ($updatedPurchases as $purchaseData) {
        $item = Item::where('name', $purchaseData['name'])->first();
        $purchase = Purchase::find($purchaseData['id']); // Assuming 'id' is the primary key column name
        if ($purchase) {
            // Update the purchase data
            $purchase->price = $purchaseData['price'];
            $purchase->item_added = $purchaseData['itemAdded'];
            $purchase->status = "Completed";
            $item->price = $purchaseData['price'];
            $item->measurement = $item->measurement + $purchaseData['itemAdded'];
            // Save the updated purchase to the database
            $item->save();
            $purchase->save();
        }
    }

}


}