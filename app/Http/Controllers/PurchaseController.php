<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Purchase;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function store(Request $request)
{
    $purchases = $request->input('purchases');
    $savedPurchases = [];
    $latestPurchase = Purchase::latest('purchase_number')->first();
    $newPurchaseNumber = $latestPurchase ? $latestPurchase->purchase_number + 1 : 1;
    
    foreach ($purchases as $purchaseData) {
        $purchase = new Purchase();
        $item = Item::where('name', $purchaseData['name'])->first();
        $purchase->name = $purchaseData['name'];
        $purchase->measurement = $purchaseData['measurement'];
        $purchase->item_id = $item->id;
        $purchase->purchase_number = $newPurchaseNumber;
        $purchase->save();
        $savedPurchases[] = $purchase;
    }
    
    return response()->json(['purchases' => $savedPurchases]);
}

public function index()
{
    $purchases = Purchase::orderBy('purchase_number')->get();
    $groupedPurchases = $purchases->groupBy('purchase_number');
    
    // Return the grouped purchases as JSON response
    return response()->json(['groupedPurchases' => $groupedPurchases]);
}


}
