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
        
        foreach ($purchases as $purchaseData) {
            $purchase = new Purchase();
            $item = Item::where('name', $purchaseData['name'])->first();
            $purchase->name = $purchaseData['name'];
            $purchase->measurement = $purchaseData['measurement'];
            $purchase->item_id = $item->id;
            $purchase->save();
            $savedPurchases[] = $purchase;
        }
        
        return response()->json(['purchases' => $savedPurchases]);
    }
}
