import LogoIcon from '../images/LogoIcon';

export default function LogoAuth({ styles }) {
	return (
		<div className={`flex flex-col w-full items-center text-3xl ${styles}`}>
			<LogoIcon styles="h-12 w-12" />
			<h1>{process.env.REACT_APP_TITLE}</h1>
		</div>
	);
}
