pragma solidity ^0.5.1;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./Ownable.sol";
import "./crowdsaleHNC.sol";
import "./bankCheck.sol";

contract HNC is ERC20, ERC20Detailed, Ownable, crowdsaleHNC, bankCheck{

    // construction information
    struct property{
        string history;
        string permission;
        string profit_analysis;
        string con_guide;
        string info;
    }
    property prop;

    // transcation
    struct usageTokenDetail{
        address from;
        address to;
        uint256 amout;
        string content;
    }
    usageTokenDetail[] statement;


    // Symbol
    string private _name = "Home&Chain";
    string private _symbol = "NHC";
    uint8 private _decimals = 2;

    // bank address
    address bankAddress  = 0xec58179D7BD7CBEd4D1a76376A1c961C61548071;

    uint256 pricePerMoney = 10000; // 현금당 토큰 가격


    // [ developer ]
    constructor(uint256 fundingGoalMonry, uint256 duration)
    ERC20Detailed(_name, _symbol, _decimals)
    crowdsaleHNC(owner(), fundingGoalMonry, duration, pricePerMoney)
    public{
        // token creation
        _mint(owner(), calculateToken(fundingGoalMonry) /*totalSupply*/ * 10**uint256(_decimals));
    }

    function calculateToken(uint256 __fundingGoalMonry) internal pure returns(uint){
        return __fundingGoalMonry / 10000;
    }

    function registerBuilding(
        string memory _history,
        string memory _permission,
        string memory _profit_analysis,
        string memory _con_guide,
        string memory _info
    ) public onlyOwner  {
        prop.history =_history;
        prop.permission = _permission;
        prop.profit_analysis = _profit_analysis;
        prop.con_guide = _con_guide;
        prop.info = _info;
    }

    function checkBuildingInformation() public view returns(
        string memory _history,
        string memory _permission,
        string memory _profit_analysis,
        string memory _con_guide,
        string memory _info
    ){
        return(
        prop.history,
        prop.permission,
        prop.profit_analysis,
        prop.con_guide,
        prop.info
        );
    }

    function investBuilding(bytes32 messageHash,  uint8 v, bytes32 r, bytes32 s, uint256 _amount, uint8 _position) public {
        require(checkBankkey(bankAddress, messageHash, v, r, s)); // bank check

        invest(_amount, _position);
    }

    function registerBuildingCostructor(address to) public{
        require(msg.sender == owner());

        registerCostructor(to);
    }

    function useToken(address _to, uint256 _amount, string memory _content) checkSuccessCrowdSaleClosed() RegistrationCheck() public{
        require((_to == bankAddress) && (_to == getBuildingCostructor()));

        transfer(_to, _amount);

        usageTokenDetail memory temp;
        temp.from = msg.sender;
        temp.to = _to;
        temp.amout = _amount;
        temp.content = _content;

        statement.push(temp);
    }

    function checkUseTokenAmount() public view checkSuccessCrowdSaleClosed() RegistrationCheck() returns(uint256 length) {
        return statement.length;
    }

    function checkUseToken(uint256 serial) public view checkSuccessCrowdSaleClosed() RegistrationCheck() returns(address _from, address _to, uint256 _amount, string memory _content){
        return (statement[serial].from, statement[serial].to, statement[serial].amout, statement[serial].content);
    }

}








