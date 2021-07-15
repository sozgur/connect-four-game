describe("Board Test", function () {
    beforeEach(function () {
        boardWidth = 7;
        boardHeight = 5;
    });
    it("should be creaate emmty matrix array on makeBoard()", function () {
        makeBoard();
        expect(board.length).toEqual(5);
        expect(board[0].length).toEqual(7);
    });
});

// TODO: Add more test
