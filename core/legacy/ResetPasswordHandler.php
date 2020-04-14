<?php


namespace SuiteCRM\Core\Legacy;


use ApiPlatform\Core\Exception\InvalidArgumentException;
use App\Entity\Process;
use App\Service\ProcessHandlerInterface;
use BadFunctionCallException;
use Exception;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;
use ResetPassword;

class ResetPasswordHandler extends LegacyHandler implements ProcessHandlerInterface, LoggerAwareInterface
{
    protected const MSG_OPTIONS_NOT_FOUND = 'Process options is not defined';
    protected const PROCESS_TYPE = 'recover-password';

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @inheritDoc
     */
    public function getProcessType(): string
    {
        return self::PROCESS_TYPE;
    }

    /**
     * @inheritDoc
     */
    public function requiredAuthRole(): string
    {
        return '';
    }

    /**
     * @inheritDoc
     */
    public function configure(Process &$process): void
    {
        //This process is synchronous
        //We aren't going to store a record on db
        //thus we will use process type as the id
        $process->setId(self::PROCESS_TYPE);
        $process->setAsync(false);

        return;
    }

    /**
     * @inheritDoc
     */
    public function validate(Process $process): void
    {
        if (empty($process->getOptions())) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }

        ['username' => $username, 'useremail' => $useremail] = $process->getOptions();

        if (empty($username) || empty($useremail)) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }
    }

    /**
     * @inheritDoc
     */
    public function run(Process &$process)
    {
        $this->init();

        require_once 'modules/Users/services/ResetPassword.php';

        $service = new ResetPassword();

        ['username' => $username, 'useremail' => $useremail] = $process->getOptions();

        $process->setStatus('success');
        $process->setMessages([
            'LBL_RECOVER_PASSWORD_SUCCESS'
        ]);

        try {
            $service->sendResetLink($username, $useremail);
        } catch (BadFunctionCallException | \InvalidArgumentException $e) {
            //logged by suite 7
        } catch (Exception $unknownException) {
            $this->logger->error($unknownException->getMessage(), ['exception' => $unknownException]);
            $process->setStatus('error');
            $process->setMessages([
                'ERR_AJAX_LOAD_FAILURE'
            ]);
        }

        $this->close();
    }

    /**
     * @inheritDoc
     */
    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}