const MatchmakerPort = 80;

const AllServers = [
    { "Name": "EUSolo1", "IP": "38.242.208.160", "Port": 7777, "Playlist": "playlist_defaultsolo", "Region": "EU" }
];

function GetServer(Playlist, Region) {
    for (let i = 0; i < AllServers.length; i++) {
        const currentArr = AllServers[i];
        const currentArrPlaylist = currentArr.Playlist;
        const currentArrRegion = currentArr.Region;

        if (currentArrPlaylist.toLowerCase() === Playlist.toLowerCase() && currentArrRegion.toLowerCase() === Region.toLowerCase()) {
            return currentArr;
        }
    }

    return { "Name": "Failed", "IP": "Failed", "Port": 6969, "Playlist": "Failed", "Region": "Failed" };
}

function IsValidServer(serverPlaylist, serverRegion) {
    for (let i = 0; i < AllServers.length; i++) {
        const currentArr = AllServers[i];
        const currentArrPlaylist = currentArr.Playlist;
        const currentArrRegion = currentArr.Region;

        if (currentArrPlaylist.toLowerCase() === serverPlaylist.toLowerCase() && currentArrRegion.toLowerCase() === serverRegion.toLowerCase()) {
            return true;
        }
    }

    return false;
}

module.exports = {
    MatchmakerPort,
    AllServers,
    GetServer,
    IsValidServer
};
