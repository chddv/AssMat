export class APIResult {

    jsonResult: any; // retourne l'objet demander si pas d'erreur
    iCodeResult: number; // retour un code d'erreur si la demande à échouer sinon 0
    strMsgResult: string; // retourne le message d'errreur

    constructor(_iCodeResult: number, _strMsgResult: string, _jsonResult: any)
    {        
        this.iCodeResult = _iCodeResult;
        this.jsonResult = _jsonResult;
        this.strMsgResult = _strMsgResult;
    }
    
}