<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function addCategory(Request $request)
    {
        $category = new Category();
        $category->category = $request->subCategory;
        $category->parent_id = $request->category;
        $category->save();
    }
    public function viewPerishable(){
        $category = Category::where('parent_id', '=', '1')->get();
        return response()->json([
            'categories' => $category
        ], 200);
    }
    public function viewNonPerishable(){
        $category = Category::where('parent_id', '=', '2')->get();
        return response()->json([
            'categories' => $category
        ], 200);
    }
}
