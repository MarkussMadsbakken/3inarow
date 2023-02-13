# Inarow

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
