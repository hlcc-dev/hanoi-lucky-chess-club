interface StepCounterProps {
    step: number;
}

function StepCounter({ step }: StepCounterProps) {
    return (
        <div className="flex items-center mb-8">

            {/* Step 1 */}
            <div
                className={`
                        w-8 h-8 flex items-center justify-center rounded-full font-semibold
                        ${step >= 1
                        ? "bg-club-primary text-club-dark"
                        : "bg-club-dark/20 text-club-dark/50"}
                        `}
            >
                1
            </div>

            {/* Bar 1 → 2 */}
            <div
                className={`
                        flex-1 h-1 mx-2 rounded
                        ${step > 1 ? "bg-club-primary" : "bg-club-dark/20"}
                        `}
            />

            {/* Step 2 */}
            <div
                className={`
                        w-8 h-8 flex items-center justify-center rounded-full font-semibold
                        ${step >= 2
                        ? "bg-club-primary text-club-dark"
                        : "bg-club-dark/20 text-club-dark/50"}
                        `}
            >
                2
            </div>

            {/* Bar 2 → 3 */}
            <div
                className={`
                        flex-1 h-1 mx-2 rounded
                        ${step > 2 ? "bg-club-primary" : "bg-club-dark/20"}
                        `}
            />

            {/* Step 3 */}
            <div
                className={`
                        w-8 h-8 flex items-center justify-center rounded-full font-semibold
                        ${step >= 3
                        ? "bg-club-primary text-club-dark"
                        : "bg-club-dark/20 text-club-dark/50"}
                        `}
            >
                3
            </div>

        </div>
    )
}

export default StepCounter;