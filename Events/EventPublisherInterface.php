<?php

namespace SfCod\SocketIoBundle\Events;

/**
 * Interface EventPublisherInterface
 * Event publish interface
 *
 * @package SfCod\SocketIoBundle\Events
 */
interface EventPublisherInterface
{
    /**
     * Process event and return result to subscribers
     *
     * @return array
     */
    public function fire(): array;
}
