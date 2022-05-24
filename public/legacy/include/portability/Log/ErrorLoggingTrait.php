<?php

trait ErrorLoggingTrait
{

    /**
     * Log errors
     * @param array $errors
     * @param string $scopeKey
     * @return void
     */
    public function logErrors(array $errors, string $scopeKey = ''): void {
        if (empty($errors)) {
            return;
        }

        foreach ($errors as $key => $error) {
            $this->logError($scopeKey, $key, $error);
        }
    }

    /**
     * Log error
     * @param string $scopeKey
     * @param string $key
     * @param string $error
     * @return void
     */
    public function logError(string $scopeKey, string $key, string $error): void {
        global $log;

        $message = [];
        if (!empty($scopeKey)) {
            $message[] = $scopeKey;
        }

        $message[] = "Key '$key'";
        $message[] = "Error '$error'";

        $log->error(implode(' | ', $message));
    }

}
