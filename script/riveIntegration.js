const r = new rive.Rive({
    src: "../assets/slate_withdraw_flow.riv",
    canvas: document.getElementById("canvas"),
    autoplay: true,
    stateMachines: "slate_withdraw_flow",
    onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        // Play a timeline animation by name
        r.play("Withdraw Jusd"); // Replace with your timeline's name
    },
});