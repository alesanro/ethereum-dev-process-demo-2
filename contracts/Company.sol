pragma solidity ^0.4.23;


import "./DevelopersRegistry.sol";


contract Company {

    event CEOUpdated(address newCEO);
    event DeveloperHired(address developer);
    event DeveloperFired(address developer);

    address public ceo;

    DevelopersRegistry public developersRegistry;

    uint public developersCount;
    mapping(uint => address) public idxToDeveloper;
    mapping(address => uint) public developerToIdx;

    modifier onlyCEO {
        if (msg.sender == ceo) {
            _;
        }
    }

    modifier onlyNotHired(address _developer) {
        if (!isDeveloperInTeam(_developer)) {
            _;
        }
    }

    modifier onlyHired(address _developer) {
        if (isDeveloperInTeam(_developer)) {
            _;
        }
    }
    
    constructor(DevelopersRegistry _developersRegistry, address[] _developers) public {
        require(address(_developersRegistry) != 0x0, "Registry should not be zero address");

        ceo = msg.sender;
        developersRegistry = _developersRegistry;
        uint _counter;
        for (uint _devIdx = 0; _devIdx < _developers.length; ++_devIdx) {
            address _developer = _developers[_devIdx];
            if (developerToIdx[_developer] == 0) {
                _counter += 1;
                idxToDeveloper[_counter] = _developer;
                developerToIdx[_developer] = _counter;
            }
        }

        developersCount = _counter;
    }

    function transferCEOChair(address _newCEO) onlyCEO external returns (bool) {
        require(_newCEO != 0x0, "New CEO address should not be zero address");

        ceo = _newCEO;
        
        emit CEOUpdated(_newCEO);
        return true;
    }

    function hireDeveloper(address _developer) 
    onlyCEO 
    onlyNotHired(_developer)
    external 
    returns (bool) 
    {
        require(_developer != 0x0, "Developer should not be zero address");

        uint _counter = developersCount + 1;
        idxToDeveloper[_counter] = _developer;
        developerToIdx[_developer] = _counter;
        developersCount = _counter;

        emit DeveloperHired(_developer);
        return true;
    }

    function fireDeveloper(address _developer) 
    onlyCEO 
    onlyHired(_developer)
    external 
    returns (bool) 
    {
        require(_developer != 0x0, "Developer should not be zero address");

        uint _developerIdx = developerToIdx[_developer];
        uint _counter = developersCount;
        if (_developerIdx != _counter) {
            address _lastDeveloper = idxToDeveloper[_counter];
            idxToDeveloper[_developerIdx] = _lastDeveloper;
            developerToIdx[_lastDeveloper] = _developerIdx;
        }

        delete idxToDeveloper[_counter];
        delete developerToIdx[_developer];

        developersCount = _counter - 1;

        emit DeveloperFired(_developer);
        return true;
    }

    function isDeveloperInTeam(address _developer)
    public
    view
    returns (bool)
    {
        return developerToIdx[_developer] != 0;
    }
    
    function getTotalRating(string _skill) 
    public 
    view 
    returns (uint _totalRating) 
    {
        uint _counter = developersCount;
        for (uint _devIdx = 1; _devIdx <= _counter; ++_devIdx) {
            uint _rating;
            (, _rating) = developersRegistry.skillDetails(idxToDeveloper[_devIdx], _skill);
            _totalRating += _rating;
        }
    }

    function () external payable {
        revert("Cannot accept ETH");
    }
}
