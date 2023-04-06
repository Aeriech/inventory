<?php

namespace App\Http\Controllers;

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
            $purchase->name = $purchaseData['name'];
            $purchase->measurement = $purchaseData['measurement'];
            $purchase->save();
            
            $savedPurchases[] = $purchase;
        }
        
        return response()->json(['purchases' => $savedPurchases]);
    }
}
