<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class ItemController extends Controller
{

    public function viewItems(){
        $items = Item::where('status', '<>', 'archive')->get();
        return response()->json([
            'items' => $items
        ], 200);
    }

    public function viewArchives(){
        $items = Item::where('status', '=', 'archive')->get();
        return response()->json([
            'items' => $items
        ], 200);
    }

    public function archive($id)
    {
        $item = Item::find($id);
        $item->status = "archive";
        $item->save();
    }

    public function unarchive($id)
    {
        $item = Item::find($id);
        $item->status = "unarchive";
        $item->save();
    }
    
    

    public function addItem(Request $request)
    {
        
        $item = new Item();

        $item->name = $request->name;
        if ($request->image!="") {
            $strpos = strpos($request->image,";");
            $sub = substr($request->image,0,$strpos);
            $ex = explode('/',$sub)[1];
            $name = time().".".$ex;
            $img = Image::make($request->image)->resize(500,500);
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
        $item->status = "unarchive";
        $item->save();
    }

    public function getItem($id)
    {
        $item = Item::find($id);
        return response()->json([
            'item' => $item
        ],200);
    }

    public function updateItem(Request $request, $id)
    {
        $item = Item::find($id);
        $item->name = $request->name;
        if($item->image!=$request->image){
            $strpos = strpos($request->image,";");
            $sub = substr($request->image,0,$strpos);
            $ex = explode('/',$sub)[1];
            $name = time().".".$ex;
            $img = Image::make($request->image)->resize(500,500);
            $upload_path = public_path()."/upload/";
            $img->save($upload_path.$name);
            $photo = $upload_path. $item->image;
            $img->save($upload_path.$name);
            if(file_exists($photo)){
                @unlink($photo);
            }
        }
        else{
            $name = $item->image;
        }
        $item->image = $name;
        $item->type = $request->type;
        $item->measurement = $request->measurement;
        $item->price = $request->price;
        $item->status = "unarchive";
        $item->save();
    }
}
