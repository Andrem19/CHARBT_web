export class Position {
    constructor(index_start, amount, buy_sell, open_price, open_time, coin_pair) {
        this.id = null;
        this.session_id = null;
        this.balance = null;
        this.current_PnL = null;
        this.index_start = index_start;
        this.index_finished = null;
        this.coin_pair = coin_pair;
        this.open_price = open_price;
        this.close_price = null;
        this.profit = 0;
        this.open_time = open_time;
        this.close_time = null;
        this.amount = amount;
        this.target_len = null;
        this.type_of_close = null;
        this.buy_sell = buy_sell;
        this.add_info = '';
    }
}
