/* 
Dette er to funksjoner gjør om string til liste og lister til string. Dette kan brukes når man skal sende lister over JSON. 

Begrensninger:
    1. Listen supporter opptil en 10-liste. Man kan eventuelt utvide ved å legge til tegn ved å i CodeArray; OBS DETTE MÅ GJØRES I BEGGE FUNKSJONENE. DE MÅ VÆRE LIKE FOR AT DET SKAL FUNKE I ALLE TILFELLER.
    2. Grunnet strukturene i funksjonene er det visse tegn som ikke er tillat. Dette er tegnene som eksisterer i CodeArray.Dette er for nå "!, @, #, $, %, &, /, (, ), ="


scw 



*/

function listToString(liste, num = 0) {
    let CodeArray = ["!","@", "#", "$", "%", "&", "/", "(", ")", "="]
    let listToStringEle = ""

    for (let i = 0; i < liste.length; i++) {
        underList = liste[i]
        
        if (typeof(underList)=="object") {
            newEle = listToString(underList, num+1)
        }
        else if (typeof(underList)=="string" || typeof(underList=="int")){
            newEle = underList 
        }

        
        if ((i != liste.length - 1) || (liste.length == 1))  {
            listToStringEle += newEle + CodeArray[num]  
        }
        else {
            listToStringEle += newEle
        }

    }
    if (liste.length == 0) {
        listToStringEle = CodeArray[num]
    }
    return listToStringEle
}

function stringToList(enTextString, num = 0) {
    let CodeArray = ["!","@", "#", "$", "%", "&","/", "(", ")","="]  

    if (enTextString.includes(CodeArray[num])) {

        let splittaOpp = enTextString.split(CodeArray[num])

        for (let underList of splittaOpp) {

            if (CodeArray.map(CodeArray => underList.includes(CodeArray)).includes(true)) {

                newUnderList = stringToList(underList, num+1)
                splittaOpp.splice(splittaOpp.indexOf(underList), 1, newUnderList)
            }
            else if (underList == "") {
                splittaOpp.splice(splittaOpp.indexOf(underList), 1)
                
            }
        }
        return splittaOpp
    }
    else if (CodeArray.map(CodeArray => enTextString.includes(CodeArray)).includes(true)) {
        splittaOppe = stringToList(enTextString, num+1)
        return [splittaOppe]
        
    }

    return "teksten kan ikke gjøre om til liste" + enTextString + CodeArray.map(CodeArray => enTextString.includes(CodeArray)).includes(true)
}
/* test = [1,2,[3,4]]
console.log(test)
new2 = listToString(test)
console.log(new2)
new3 = stringToList(new2)
console.log(new3) */
tester = [[], [],[],[],[]]
function leggtilNull(liste) {
    console.log(liste)
    for (let i = 0; i < liste.length; i++) {
        underList = liste[i]
        
        if (typeof(underList)=="object") {
            newEle = leggtilNull(underList)
        }
        else {
            underList.push(0) 
        }
        console.log(underList)
        console.log(liste)

        

    }
    return liste
}
console.log(leggtilNull(tester))