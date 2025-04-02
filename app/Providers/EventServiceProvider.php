<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\EventRepository;
use App\Services\EventService;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Registre os serviços no contêiner de aplicação.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            EventRepository::class,
            EventRepository::class
        );

        $this->app->bind(
            EventService::class,
            EventService::class
        );
    }

    /**
     * Faça qualquer trabalho de inicialização após todos os serviços estarem registrados.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
