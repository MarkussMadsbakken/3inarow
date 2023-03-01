/* 
Dette er to funksjoner gjør om string til liste og lister til string. Dette kan brukes når man skal sende lister over JSON. 

Begrensninger:
    1. Listen supporter opptil en 10-liste. Man kan eventuelt utvide ved å legge til tegn ved å i CodeArray; OBS DETTE MÅ GJØRES I BEGGE FUNKSJONENE. DE MÅ VÆRE LIKE FOR AT DET SKAL FUNKE I ALLE TILFELLER.
    2. Grunnet strukturene i funksjonene er det visse tegn som ikke er tillat. Dette er tegnene som eksisterer i CodeArray.Dette er for nå "!, @, #, $, %, &, /, (, ), ="


scw 



*/

function stringToList(liste, num = 0) {
    let CodeArray = ["!","@", "#", "$", "%", "&", "/", "(", ")", "="]
    let listToString = ""

    for (let i = 0; i < liste.length; i++) {
        underList = liste[i]
        
        if (typeof(underList)=="object") {
            newEle = stringCoderMaxIsLenOfCodeArray(underList, num+1)
        }
        else if (typeof(underList)=="string" || typeof(underList=="int")){
            newEle = underList 
        }

        
        if ((i != liste.length - 1) || (liste.length == 1))  {
            listToString += newEle + CodeArray[num]  
        }
        else {
            listToString += newEle
        }

    }
    return listToString
}

function listToString(enTextString, num = 0) {
    let CodeArray = ["!","@", "#", "$", "%", "&","/", "(", ")","="]  

    if (enTextString.includes(CodeArray[num])) {

        let splittaOpp = enTextString.split(CodeArray[num])

        for (let underList of splittaOpp) {

            if (CodeArray.map(CodeArray => underList.includes(CodeArray)).includes(true)) {

                newUnderList = stringDecoderMaxIsLenOfCodeArray(underList, num+1)
                splittaOpp.splice(splittaOpp.indexOf(underList2), 1, underList2)
            }
            else if (underList == "") {
                splittaOpp.splice(splittaOpp.indexOf(underList), 1)
            }
        }
        return splittaOpp
    }
    else if (CodeArray.map(CodeArray => enTextString.includes(CodeArray)).includes(true)) {
        splittaOppe = stringDecoderMaxIsLenOfCodeArray(enTextString, num+1)
        return [splittaOppe]
        
    }

    return "teksten kan ikke gjøre om til liste" + enTextString + CodeArray.map(CodeArray => enTextString.includes(CodeArray)).includes(true)
}