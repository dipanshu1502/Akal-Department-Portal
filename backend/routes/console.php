<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('portal:about', function () {
    $this->comment('Akal Department Portal API');
})->purpose('Show portal application information');
