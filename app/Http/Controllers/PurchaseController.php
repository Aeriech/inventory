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

}
