pragma solidity ^0.4.23;

import "./Developer.sol";

contract Company {
    
    address[] public developers;
    Developer public developer;
    
    constructor(Developer _developer, address[] _developers) public {
        developer = _developer;
        developers = _developers;
    }
    
    function getTotalRating(string _skill) public view returns (uint _totalRating) {
        address[] storage _developers = developers;
        for (uint _devIdx = 0; _devIdx < _developers.length; ++_devIdx) {
            uint _rating;
            (, _rating) = developer.skillDetails(_developers[_devIdx], _skill);
            _totalRating += _rating;
        }
    }
    
}
