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
}
