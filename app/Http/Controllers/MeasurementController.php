<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Measurement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use function PHPSTORM_META\type;

class MeasurementController extends Controller
{
    public function addMeasurement(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'measurement' => 'required',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $measurement = new Measurement();
        $measurement->measurement = $request->measurement;
        $measurement->save();

        $log = new History();
        $log->type = "Add";
        $log->description = "[ID:1] added new measurement: ".$request->measurement;
        $log->created_by = 1;
        $log->save();
    }
    public function viewMeasurement(){
        $measurement = Measurement::all();
        return response()->json([
            'measurements' => $measurement
        ], 200);
    }
}
