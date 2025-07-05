local HasSpawned = false

AddEventHandler("playerSpawned", function()
    if not HasSpawned then
        HasSpawned = true
        Wait(1000)
        SendNUIMessage({ action = "hide" })
        ShutdownLoadingScreenNui()
    end
end)
