<?php
class LoginLinkController extends Controller
{
  private function actionAndRedirect(
    String $result, User $user, array $queryParams
  )
  {
        $currentUser = $this->getCurrentUserService()->getUser();
        if ($currentUser->getUserId() != $request->get('userId')) {
            $this->set('logout_redirect', $request->getParentUri());
            return $this->redirect('/logout/');
        }
        $result = $this->getLoginService()->consumeLoginLinkRequest($request);

        //Code to handle custom logic for denied login links
        $defaultRedirectUrl = '/login/';
        switch ($result['type']) {
            case (LoginLinkTypes::FINALS_SALE):
                $this->getSessionService()->set('from_finals_email_campaign');
                $defaultRedirectUrl = '/login/?login_redirect='
                break;
            case (LoginLinkTypes::CART_ABANDONMENT):
                $dbFilename = $request->query->get('db_filename');
                $defaultRedirectUrl = $dbFilename ? '/file/' . $dbFilename)
                break;
        }
        return $returnResponse;
    }
}
