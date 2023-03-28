<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class ReceiptController extends Controller
{

    public function viewReceipts(){
        $receipt = Receipt::all();
        return response()->json([
            'receipts' => $receipt
        ],200);
    }

    public function addReceipt(Request $request)
    {
        
        $receipt = new Receipt();

        $receipt->description = $request->description;
        if ($request->image!="") {
            $strpos = strpos($request->image,";");
            $sub = substr($request->image,0,$strpos);
            $ex = explode('/',$sub)[1];
            $name = time().".".$ex;
            $img = Image::make($request->image)->resize(500,500);
            $upload_path = public_path()."/upload/";
            $img->save($upload_path.$name);
            $receipt->image = $name;
        }
        else{
            $receipt->image = "image.png";
        }
        $receipt->image = $name;
        $receipt->amount = $request->amount;
        $receipt->save();
    }
}
