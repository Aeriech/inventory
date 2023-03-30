<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function viewLogs(){
        $log = History::all();
        return response()->json([
            'logs' => $log
        ],200);
    }
}
