# Inarow

Php er virker som om kun er for å sende enkle meldinger til server og tilbake, er ikke ment å være et skript om kjører konstant. Derfor blir det lettere å lage det i node.js

For å sende data fra serveren fungere nok server sent events best. Det lages en eventListener, så man trenger ikke å styre mye med connection timeout. Websockets gjør at man kan sende data kontinuerling, noe som vi egentlig ikke trenger. Med sse kan vi sende data til serveren, og så pushe dataen til alle samtidig.

## installasjon av Node.js
1. last ned Node.js fra https://nodejs.org/en/
2. kjør node -version i cmd (--version i terminal)
3. last ned Node.js exec vscode extension
4. kjør app.js ved å trykke f8, og avslutt med f9


</br>
</br>

### To do:
* sende data fra spiller til server (bare oppdateringer)
* server oppdaterer spillere på hvert move (server-sent events)
* separere brukere og holde styr på hvem sin tur det er.
* oppdatere hvor mange spillere som er med, og hvor mange som venter på å bli med. Slags køsystem
* backend server. php?
* chat, lett å lage etter vanlig gameupdate
* lage egene spillrom, hvor man kan endre innstillinger


Elo: 
* Ea = 1/(1+(10**((Rb-Ra)/400)))
    * R er rating
    * E er forventet utfall
* Ra = Ra+K(Sa - Ea)
    * R er rating
    * K er en kostant som kontrollerer hvor sensitiv ratingen blir
    * E er forventet utfall
    * Sa er det faktiske utfallet

## installasjon av php (trengs ikke)
1. last ned php fra https://windows.php.net/download#php-8.2
2. åpne extension. Skriv inn @builtin php og disable php language features
3. installer extensionene PHP Intelephense og PHP Server
4. trykk ctrl + , og søk på php. 
5. endre PHP Path til hvor du har installert php. eks. c:/php/php.exe
6. endre Phpserver:browser til Chrome (eller hvilken nettleser du vil)
7. åpne test.php ved å trykke på phpserver ikonet hvor kjør vanligvis ville vært
8. output skal oppdateres hvert sekund med dato + test
9. for å stoppe serven, trykk ctrl + shift + p og trykk "stop server"