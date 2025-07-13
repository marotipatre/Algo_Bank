from algopy import Account, ARC4Contract, BoxMap, Global, Txn, UInt64, gtxn, itxn, String, Box, GlobalState, LocalState, Asset
from algopy.arc4 import abimethod

class PersonalBank(ARC4Contract):
    totaldeposit: UInt64
    totalwithdrawn: LocalState[UInt64]
    reward_asset: Asset  # To store our reward asset ID

    def __init__(self) -> None:
        """Initializes contract storages on deployment"""
        self.depositors = BoxMap(Account, UInt64, key_prefix="")
        self.github = Box(String, key=b"git")
        self.totaldeposit = UInt64(0)
        self.reward_asset = Asset(0)  # Initially no reward asset created
        self.totalwithdrawn = LocalState(UInt64, key="withdraw_count")
        
        
        

    @abimethod()
    def create_reward_token(self, pay_txn: gtxn.PaymentTransaction) -> None:
        assert (
            pay_txn.receiver == Global.current_application_address
        ), "Receiver must be the contract address"
        assert pay_txn.amount == 1_000_000, "Deposit amount must be greater than zero"
        """Creates a reward token for the personal bank"""
        assert not self.reward_asset, "Reward token already created"
        assert Txn.sender == Global.creator_address, "Only the contract can create the reward token"
        # Create reward token with 100 total supply
        asset_creation = itxn.AssetConfig(
        total=100,
        decimals=0,  # Non-divisible tokens (1 whole token per reward)
        unit_name="BANKRWD",
        asset_name="Bank Reward",
        manager=Global.creator_address,
        reserve=Global.creator_address,
        freeze=Global.creator_address,
        clawback=Global.creator_address,
        fee=0
        ).submit()
    
        self.reward_asset = asset_creation.created_asset


    @abimethod()
    def deposit(self, user: String, pay_txn: gtxn.PaymentTransaction) -> UInt64:
        """Deposits funds into the personal bank and gives 1 reward token"""
        assert (
            pay_txn.receiver == Global.current_application_address
        ), "Receiver must be the contract address"
        assert pay_txn.amount > 0, "Deposit amount must be greater than zero"

        deposit_amt, deposited = self.depositors.maybe(pay_txn.sender)

        if deposited:
            self.depositors[pay_txn.sender] += pay_txn.amount
        else:
            self.depositors[pay_txn.sender] = pay_txn.amount
            # Send reward token only to new depositors
            itxn.AssetTransfer(
                asset_receiver=pay_txn.sender,
                xfer_asset=self.reward_asset,
                asset_amount=1,
                fee=0
            ).submit()

        self.github.value = user
        self.totaldeposit += pay_txn.amount

        return self.depositors[pay_txn.sender]

    # ... rest of the contract methods remain the same ...
    @abimethod()
    def withdraw(self, amountw: UInt64) -> UInt64:
        """Withdraws funds from the sender's account"""
        deposit_amt, deposited = self.depositors.maybe(Txn.sender)
        assert deposited, "No deposits found for this account"
        assert amountw <= deposit_amt, "Withdrawal amount exceeds balance"

        result = itxn.Payment(
            receiver=Txn.sender,
            amount=amountw,
            fee=0,
        ).submit()

        self.depositors[Txn.sender] = deposit_amt - amountw
        if self.depositors[Txn.sender] == UInt64(0):
            del self.depositors[Txn.sender]
        self.totalwithdrawn[Txn.sender] = self.totalwithdrawn.get(Txn.sender, UInt64(0)) + UInt64(1)

        user = self.github.value

        return self.depositors[Txn.sender]
    
    @abimethod(readonly=True)
    def withdraw_count(self) -> UInt64:
        """Returns the number of times the sender has withdrawn funds"""
        return self.totalwithdrawn.get(Txn.sender, UInt64(0))
    
    @abimethod(readonly=True)
    def get_reward_asset_id(self) -> UInt64:
        """Returns the ID of the reward asset"""
        return self.reward_asset.id
    
    @abimethod(readonly=True)
    def get_total_deposit(self) -> UInt64:
        """Returns the total amount deposited in the personal bank"""
        return self.totaldeposit
    
    @abimethod(allow_actions=['OptIn'])
    def opt_in(self) -> String:
        user = self.github.value
        return user

    @abimethod(allow_actions=['CloseOut'])
    def opt_out(self) -> None:
        pass