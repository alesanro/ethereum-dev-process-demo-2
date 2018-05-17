pragma solidity ^0.4.23;


contract DevelopersRegistry {
    
    event SkillImproved(address developer, string skill, uint added);
    
    struct SkillDetails {
        uint value;
    }
    
    address wallet;
    mapping(address => mapping(string => SkillDetails)) skills;
    
    constructor(address _wallet) public {
        require(_wallet != 0x0);
        wallet = _wallet;
    }
    
    function improveSkill(string _skill) external payable {
        require(msg.value > 0, "Should send some money for improving your skill");
        
        SkillDetails memory _details = skills[msg.sender][_skill];
        skills[msg.sender][_skill].value = _details.value + msg.value;
        
        wallet.transfer(msg.value);
        
        emit SkillImproved(msg.sender, _skill, msg.value);
    }
    
    function skillDetails(address _dev, string _skill) 
    public 
    view 
    returns 
    (uint _value, uint _rating) 
    {
        SkillDetails memory _details = skills[_dev][_skill];
        return (_details.value, _details.value / 10**16);
    }
  
    function () external payable {
        revert("Cannot accept ETH");
    }
}