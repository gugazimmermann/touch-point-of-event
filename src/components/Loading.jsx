export default function Loading() {
	return (
		<div className="flex flex-col justify-center items-center mt-4 text-primary">
			<div className="mb-4 text-primary-500 font-bold">Carregando...</div>
			<div className="animate-spin rounded-full h-32 w-32 border-b-8 border-primary" />
		</div>
	);
}
