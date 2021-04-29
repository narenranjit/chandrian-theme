<?php
class LoginLinkController extends Controller
{
  private function actionAndRedirect(String $result, User $user, array $queryParams)
  {
        $currentUser = $this->getCurrentUserService()->getUser();
        if ($currentUser && $currentUser->getUserId() != $request->get('userId')) {
            $this->getSessionService()->set('logout_redirect', $request->getParentUri());
            return $this->redirect('/logout/');
        }
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
                $defaultRedirectUrl = $dbFilename ? '/file/' . $dbFilename . QueryParamUtility::getQueryParamsURL($request, $excludedQueryParams) : $defaultRedirectUrl;
                break;
        }
        return $returnResponse;
    }
}
