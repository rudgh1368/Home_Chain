pragma solidity >=0.4.22 <0.6.0;

import "./ERC20.sol";

contract crowdsaleHNC is ERC20{
    address public beneficiary;                     // developer
    uint public fundingGoal;                        // goal money of a contract
    uint public amountRaised;                       // money earned (real monry)
    uint public startTime;
    uint public deadline;
    uint public price;

    // 투자자, 수분양자, 시공사 정보
    // 시공사 : 0 투자자 : 1, 수분양자 : 2 시공사 : 3

    struct interestedPerson{
        uint256 realMoney;
        uint8 position;
        bool registerState;

    }
    mapping(address=> interestedPerson) interestedPersons;
    address buildingCostructor;

    uint256 interestedPersonsNumber;

    bool fundingGoalReached = false;
    bool crowdsaleClosed = false;
    bool registeredBuildingCostructor = false;

    event GoalReached(address recipient, uint totalAmountRaised);
    event FundTransfer(address backer, uint amount, bool isContribution);

    // time check ( exceed time)
    modifier afterDeadline() { if (now > deadline) _; }
    modifier beforeDeadline() { if (now <= deadline) _; }

    modifier checkSuccessCrowdSaleClosed() {if (crowdsaleClosed && fundingGoalReached) _; }

    // register check
    modifier RegistrationCheck() {if(interestedPersons[msg.sender].registerState) _; }

    /**
     * Constructor
     */
    constructor(
        address ifSuccessfulSendTo,         // developer
        uint _fundingGoal,                  // goal money of a contract (real money)
        uint durationInDays,             // the term of a contract
        uint costOfEachToken                // Price per token
    ) public {
        beneficiary = ifSuccessfulSendTo;
        fundingGoal = _fundingGoal;
        startTime = now;
        deadline = now + durationInDays * 1 days;
        price = costOfEachToken;
        interestedPersons[msg.sender].position = 0;
        interestedPersons[msg.sender].registerState = true;
    }

    /**
     * Invest function
     */
    function invest(uint256 _amount, uint8 _postion) internal beforeDeadline {
        require(!crowdsaleClosed);
        require(!fundingGoalReached);

        uint256 temp = amountRaised;
        temp += _amount;

        // 투자금이 fundingGoal를 초과하지 않는다.

        require(temp <= fundingGoal);

        interestedPersons[msg.sender].realMoney += _amount;   // invested money
        interestedPersons[msg.sender].position = _postion;
        interestedPersons[msg.sender].registerState = true;

        interestedPersonsNumber ++;

        amountRaised += _amount;
        checkFundingGoalReached();

        // ERC20.transfer(msg.sender, amount / price);         // a token payment for one's investment
        emit FundTransfer(msg.sender, _amount, true);

    }

    function registerCostructor(address to) internal checkSuccessCrowdSaleClosed {
        require(!registeredBuildingCostructor);

        buildingCostructor = to;

        registeredBuildingCostructor = true;
    }

    function ckeckState() public view RegistrationCheck() returns(
        uint256 __fundingGoalMonry,
        uint256 _amountRaised,
        uint256 _startTime,
        uint256 _deadLine,
        uint256 _interestedPersonsNumber,
        address _buildingCostructor){

        return(fundingGoal, amountRaised, startTime, deadline, interestedPersonsNumber, buildingCostructor);
    }

    function checkDetailState() public view RegistrationCheck() returns(
        uint256 _amount,
        uint8   _position){

        return (interestedPersons[msg.sender].realMoney, interestedPersons[msg.sender].position);
    }

    function getBuildingCostructor() internal view returns(address){
        return buildingCostructor;
    }


    /**
     * Check if goal was reached
     *
     * Checks if the goal or time limit has been reached and ends the campaign
     *
     * End of investment when you achieve your goal
     */
    function checkFundingGoalReached() internal beforeDeadline {
        if (amountRaised == fundingGoal){
            fundingGoalReached = true;
            crowdsaleClosed = true;
            emit GoalReached(beneficiary, amountRaised);
        }
    }

    function checkGoalReached() public afterDeadline {
        if (amountRaised == fundingGoal){
            fundingGoalReached = true;
            emit GoalReached(beneficiary, amountRaised);
        }
        crowdsaleClosed = true;
    }


    /**
     * Withdraw the funds
     *
     * Checks to see if goal or time limit has been reached, and if so, and the funding goal was reached,
     * sends the entire amount to the beneficiary. If goal was not reached, each contributor can withdraw
     * the amount they contributed.
     */
    // ((( further development )))
    // function safeWithdrawal() public  {

    //     if (!fundingGoalReached) {
    //         // a bank payment
    //     }

    //     if (fundingGoalReached && beneficiary == msg.sender) {
    //         if (msg.sender.send(amountRaised)) {
    //           emit FundTransfer(beneficiary, amountRaised, false);
    //         } else {
    //             //If we fail to send the funds to beneficiary, unlock funders balance
    //             fundingGoalReached = false;
    //         }
    //     }
    // }
}

