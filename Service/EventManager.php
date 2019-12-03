<?php

namespace SfCod\SocketIoBundle\Service;

/**
 * Class EventManager
 *
 * @author Virchenko Maksim <muslim1992@gmail.com>
 *
 * @package SfCod\SocketIoBundle\Service
 */
class EventManager
{
    protected $namespace;

    /**
     * Array of events
     *
     * @var array
     */
    protected $namespaces;

    /**
     * Project root directory
     *
     * @var string
     */
    protected $rootDir;

    /**
     * List with all events
     *
     * @var array
     */
    protected static $list = [];

    /**
     * EventManager constructor.
     *
     * @param string $rootDir
     * @param array $namespaces
     * @param string $namespace
     */
    public function __construct(string $rootDir, array $namespaces = [], string $namespace = '')
    {
        $this->rootDir = $rootDir;
        $this->namespaces = $namespaces;
        $this->namespace = $namespace;
    }

    /**
     * Get events list
     *
     * @return array
     */
    public function getList(): array
    {
        //@todo remove this, move to extension using tags
        if (empty(self::$list)) {
            foreach ($this->namespaces as $key => $namespace) {
                $alias = $this->rootDir . '/' . str_replace('\\', DIRECTORY_SEPARATOR, trim($namespace, '\\'));

                foreach (glob(sprintf('%s/**.php', $alias)) as $file) {
                    $className = sprintf('%s\%s\%s', rtrim($this->namespace, '\\'), $namespace, basename($file, '.php'));

                    if (method_exists($className, 'name')) {
                        self::$list[$className::name()] = $className;
                    }
                }
            }
        }

        return self::$list;
    }
}
