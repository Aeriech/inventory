<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function addCategory(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'category' => 'required',
            'subCategory' => 'required',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        $category = new Category();
        $category->category = $request->subCategory;
        $category->parent_id = $request->category;
        $category->save();

        $log = new History();
        $log->type = "Add";
        $log->description = "[ID:1] added new category:".$request->subCategoty;
        $log->created_by = 1;
        $log->save();
    }
    public function viewCategory(){
        $categories = Category::whereNotNull('parent_id')->get();
        return response()->json([
            'categories' => $categories
        ], 200);
    }
}
