import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/not-found/NotFound';
import Home from './pages/home/Home';

function App() {
	return (
		<Routes>
			<Route path="*" element={<NotFound />} />
			<Route path="/:id" element={<Home />} />
		</Routes>
	);
}

export default App;
