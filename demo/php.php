<?php

namespace CourseHero\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use CourseHero\UtilsBundle\Component\Request;

use CourseHero\RewardBundle\Constants\ActionTypes;
use CourseHero\RewardBundle\Event\LogRewardActionEvent;
use CourseHero\UserBundle\Constants\LoginLinkTypes;
use CourseHero\UserBundle\Entity\User;
use CourseHero\UserBundle\Service\CurrentUserService;
use CourseHero\UserBundle\Service\LoginLinkService;
use CourseHero\UserBundle\Service\SessionService;
use CourseHero\UserBundle\Service\Account\EmailService;
use CourseHero\UtilsBundle\Entity\Update;
use CourseHero\UtilsBundle\Entity\UpdateRepository;
use CourseHero\UtilsBundle\Service\Event\Dispatcher;

use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Validator\Constraints\DateTime;
use CourseHero\UtilsBundle\Utility\QueryParamUtility;

class LoginLinkController extends Controller
{
    /**
     * @return LoginLinkService
     */
    private function getLoginLinkService()
    {
        return $this->get(LoginLinkService::SERVICE_ID);
    }

    /**
     * @return CurrentUserService
     */
    private function getCurrentUserService()
    {
        return $this->get(CurrentUserService::SERVICE_ID);
    }

    /**
     * @return SessionService
     */
    private function getSessionService()
    {
        return $this->get(SessionService::SERVICE_ID);
    }

    /**
     * @return EmailService
     */
    private function getEmailService()
    {
        return $this->get(EmailService::SERVICE_ID);
    }

    /**
     * @Route("/loginlink/", name="login-link")
     */
    public function accountEntryAction(Request $request)
    {
        $currentUser = $this->getCurrentUserService()->getUser();
        if ($currentUser && $currentUser->getUserId() != $request->get('userId')) {
            $this->getSessionService()->set('logout_redirect', $request->getParentUri());
            return $this->redirect('/logout/');
        }
        //AB Test for Free Unlocks
        $result = $this->getLoginLinkService()->consumeLoginLinkRequest($request);

        //Code to handle custom logic for denied login links that still want to execute some action should go here
        $defaultRedirectUrl = '/login/';
        switch ($result['type']) {
            case (LoginLinkTypes::FINALS_SALE):
                $this->getSessionService()->set('from_finals_email_campaign', true);
                $defaultRedirectUrl = '/login/?login_redirect=' . urlencode('/finals/special-offer');
                break;
            case (LoginLinkTypes::CART_ABANDONMENT):
                $dbFilename = $request->query->get('db_filename');
                $excludedQueryParams = ['db_filename', 'loginKey', 'userId'];
                $defaultRedirectUrl = $dbFilename ? '/file/' . $dbFilename . QueryParamUtility::getQueryParamsURL($request, $excludedQueryParams) : $defaultRedirectUrl;
                break;
        }

        //Switch statement to determine where to direct to after accepting login link
        //This may not necessarily be useful in all cases
        if ($result['result'] === true) {
            $returnResponse = $this->actionAndRedirect($result['type'], $result['user'], $request->query->all());
        } else {
            $returnResponse = $this->redirect($defaultRedirectUrl);
        }
        return $returnResponse;
    }

    /**
     * Takes a login type string and redirects to the appropriate page type. Can also hand different custom logic
     *
     * @param String $result
     * @param User $user
     * @param array $queryParams
     *
     * @return RedirectResponse
     */
    private function actionAndRedirect(String $result, User $user, array $queryParams)
    {
        switch ($result) {
            case (LoginLinkTypes::FREE_UNLOCKS):
                $dashboardURL = $this->generateUrl("dashboard");
                return $this->redirect($dashboardURL);
                break;
            case (LoginLinkTypes::FINALS_SALE):
                $finalsUrl = "/finals/special-offer";
                $this->getSessionService()->set('from_finals_email_campaign', true);
                return $this->redirect($finalsUrl);
                break;
            case (LoginLinkTypes::CART_ABANDONMENT):
                $dbFilename = $queryParams['db_filename'];
                return $this->redirect('/file/' . $dbFilename);
                break;
            case (LoginLinkTypes::UQ_CART_ABANDONMENT):
                $categoryName = $queryParams['category_name'];
                $questionId = $queryParams['question_id'];
                return $this->redirect('/tutors-problems/' . $categoryName . "/" . $questionId);
            case (LoginLinkTypes::UPLOADER_EMAIL_VERIFICATION):
                $verificationDate = new \DateTime();
                $dashboardUrl = "home/verify-email/";
                $redirectUrl = $this->getEmailService()->generateVerificationUrl($user->getEmail(), $user->getUserId(), $verificationDate, $dashboardUrl);
                return $this->redirect($redirectUrl);
            case (LoginLinkTypes::UPLOADER_SWEEPSTAKES):
                return $this->redirect('/upload/?utm_content=sweepstakes');
            default:
                return $this->redirect("/");
                break;
        }
    }

    public function getDispatcher() : Dispatcher
    {
        return $this->get(Dispatcher::SERVICE_ID);
    }
}
