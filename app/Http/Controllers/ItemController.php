<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class ItemController extends Controller
{

    public function View_Items(){
        $item = Item::all();
        return response()->json([
            'items' => $item
        ],200);
    }

    public function Add_Item(Request $request)
    {
        
        $item = new Item();

        $item->name = $request->name;
        if ($request->image!="") {
            $strpos = strpos($request->image,";");
            $sub = substr($request->image,0,$strpos);
            $ex = explode('/',$sub)[1];
            $name = time().".".$ex;
            $img = Image::make($request->image)->resize(500,500);//500,500
            $upload_path = public_path()."/upload/";
            $img->save($upload_path.$name);
            $item->image = $name;
        }
        else{
            $item->image = "image.png";
        }
        $item->image = $name;
        $item->type = $request->type;
        $item->measurement = $request->measurement;
        $item->price = $request->price;
        $item->save();
    }
}
