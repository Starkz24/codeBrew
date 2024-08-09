import { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";

type WorkspaceProps = {
	problem: Problem;
};

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);

	return (
		<Split className='split' minSize={0}>
			<ProblemDescription problem={problem} _solved={solved} />
			<div className='bg-dark-fill-2'>
				<Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved} />
			</div>
		</Split>
	);
};
export default Workspace;
