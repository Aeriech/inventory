<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Item;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image;

class ItemController extends Controller
{
    public function viewItems(Request $request)
    {
        $items = Item::where('status', '<>', 'archive');

        if ($request->has('category')) {
            $category = $request->query('category');
            if ($category !== 'All Item') {
                $items->where('type', $category);
            }
        }

        $items = $items->paginate(30, ['*'], 'page', $request->query('page'));


        return response()->json($items);
    }

    public function ViewArchives(Request $request)
    {
        $items = Item::where('status', '=', 'archive');

        if ($request->has('category')) {
            $category = $request->query('category');
            if ($category !== 'All Item') {
                $items->where('type', $category);
            }
        }

        $items = $items->paginate(30, ['*'], 'page', $request->query('page'));


        return response()->json($items);
    }


    public function archive($id)
    {
        $item = Item::find($id);
        $item->status = "archive";
        $item->save();

        $log = new History();
        $log->type = "Archive";
        $log->description = "[ID = {$id}] Archived Item " . $item->name;
        $log->created_by = $id;
        $log->save();
    }


    public function unarchive($id)
    {
        $item = Item::find($id);
        $item->status = "unarchive";
        $item->save();

        $log = new History();
        $log->type = "Archive";
        $log->description = "[ID = {$id}] Unarchived Item " . $item->name;
        $log->created_by = $id;
        $log->save();
    }



    public function addNewItem(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required',
        'category' => 'required',
        'measure' => 'required',
        'measurement' => 'required|numeric',
        'price' => 'required|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $item = new Item();

    $item->name = $request->name;

    if ($request->image != "") {
        $strpos = strpos($request->image, ";");
        $sub = substr($request->image, 0, $strpos);
        $ex = explode('/', $sub)[1];
        $name = time() . "." . $ex;
        $img = Image::make($request->image)->resize(500, 500);
        $upload_path = public_path() . "/upload/";
        $img->save($upload_path . $name);
        $item->image = $name;
    } else {
        $item->image = "image.png";
    }

    $item->type = $request->category;
    $item->measured_in = $request->measure;
    $item->measurement = $request->measurement;
    $item->price = $request->price;
    $item->status = "unarchive";
    $item->save();

    $log = new History();
    $log->type = "Add";
    $log->description = "[ID = {$item->id}] Added New Item Name:" . $request->name . ", Price:" . $request->price . ", and Qty:" . $request->measurement;
    $log->created_by = $item->id;
    $log->save();

}


    public function getItem($id)
    {
        $item = Item::find($id);
        return response()->json([
            'item' => $item
        ], 200);
    }

    public function updateItem(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'category' => 'required',
            'measure' => 'required',
            'measurement' => 'required|numeric',
            'price' => 'required|numeric',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item = Item::find($id);
        $item->name = $request->name;
        if ($item->image != $request->image) {
            $strpos = strpos($request->image, ";");
            $sub = substr($request->image, 0, $strpos);
            $ex = explode('/', $sub)[1];
            $name = time() . "." . $ex;
            $img = Image::make($request->image)->resize(500, 500);
            $upload_path = public_path() . "/upload/";
            $img->save($upload_path . $name);
            $photo = $upload_path . $item->image;
            $img->save($upload_path . $name);
            if (file_exists($photo)) {
                @unlink($photo);
            }
        } else {
            $name = $item->image;
        }
        $item->image = $name;
        $item->type = $request->category;
        $item->measured_in = $request->measure;
        $item->measurement = $request->measurement;
        $item->price = $request->price;
        $item->save();

        $log = new History();
        $log->type = "Update";
        $log->description = "[ID = {$item->id}] Updated Item Name:" . $request->name . ", Price:" . $request->price . ", and Qty:" . $request->measurement;
        $log->created_by = $item->id;
        $log->save();
    }

//     public function updateItems(Request $request)
// {
//     $validator = Validator::make($request->all(), [
//         '*.id' => 'required|exists:items,id',
//         '*.name' => 'required',
//         '*.category' => 'required',
//         '*.measure' => 'required',
//         '*.measurement' => 'required|numeric',
//         '*.price' => 'required|numeric',
//     ]);

//     if ($validator->fails()) {
//         return response()->json(['errors' => $validator->errors()], 422);
//     }

//     foreach ($request->all() as $itemData) {
//         $item = Item::find($itemData['id']);
//         $item->name = $itemData['name'];
//         if ($item->image != $itemData['image']) {
//             $strpos = strpos($itemData['image'], ";");
//             $sub = substr($itemData['image'], 0, $strpos);
//             $ex = explode('/', $sub)[1];
//             $name = time() . "." . $ex;
//             $img = Image::make($itemData['image'])->resize(500, 500);
//             $upload_path = public_path() . "/upload/";
//             $img->save($upload_path . $name);
//             $photo = $upload_path . $item->image;
//             $img->save($upload_path . $name);
//             if (file_exists($photo)) {
//                 @unlink($photo);
//             }
//         } else {
//             $name = $item->image;
//         }
//         $item->image = $name;
//         $item->type = $itemData['category'];
//         $item->measured_in = $itemData['measure'];
//         $item->measurement = $itemData['measurement'];
//         $item->price = $itemData['price'];
//         $item->save();

//         $log = new History();
//         $log->type = "Update";
//         $log->description = "[ID = {$item->id}] Updated Item Name:" . $itemData['name'] . ", Price:" . $itemData['price'] . ", and Qty:" . $itemData['measurement'];
//         $log->created_by = $item->id;
//         $log->save();
//     }

// }


    public function useItem(Request $request, $id)
    {
        $item = Item::find($id);
        $maxValue = $item->measurement;
        $validator = Validator::make($request->all(), [
            'useItem' => 'required|numeric|min:1|max:' . $maxValue
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item->measurement = $item->measurement - $request->useItem;
        $item->save();

        $log = new History();
        $log->type = "Update";
        $log->description = "[ID = {$item->id}] Updated Item Name:" . $item->name . ", and Qty:" . $request->useItem;
        $log->created_by = $item->id;
        $log->save();
    }

    public function addPurchase(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'addPurchase' => 'required|numeric|min:1|',
    'addPrice' => 'required|numeric|min:1',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $item = Item::find($id);
        $item->measurement = $item->measurement + $request->addPurchase;
        $item->price = $request->addPrice;
        $item->save();

        $purchase = new Purchase();
        $purchase->item_id = $id;
        $purchase->price = $request->addPrice;
        $purchase->measurement = $request->addPurchase;
        $purchase->item_left = $request->addPurchase;
        $purchase->save();

        $log = new History();
        $log->type = "Update";
        $log->description = "[ID = {$item->id}] Updated Item Name:" . $item->name . ", Price:" . $request->addPrice . ", and Qty:" . $request->addPurchase;
        $log->created_by = $item->id;
        $log->save();
    }
}
