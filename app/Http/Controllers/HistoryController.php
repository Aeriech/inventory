<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function viewLogs(Request $request) {
        $log = History::query();
        if ($request->has('type')) {
            $type = $request->query('type');
            if ($type !== 'All Log') {
                $log->where('type', $type);
            }
        }
        $log = $log->paginate(30, ['*'], 'page', $request->query('page'));
        return response()->json($log);
    }
    
}
