import { Link } from 'react-router-dom';
import background from '../../assets/imgs/background.png'

function Home() {
    return (
    <>
    <section className="h-[100vh] bg-cover bg-no-repeat bg-center flex justify-center items-center " style={{ backgroundImage: `url(${background})` }}>
        <div className='bg-black opacity-80 flex flex-col items-center justify-center gap-10 p-10 sm:p-15 m-5 md:m-5 w-8/10 rounded-3xl'>
            <h1 className='font-bold text-center text-4xl  sm:text-6xl lg:text-8xl'>Seu próximo filme começa aqui</h1>
            <div className='flex flex-col sm:flex-row gap-4 '>
                <Link to="/register">
                <button className='font-bold border-[1px] py-3 px-8 rounded-[10px] w-35'>Cadastrar</button>
                </Link>
                <Link to="/login">
                <button className='font-bold py-3 px-8 rounded-[10px] bg-purple-600 w-35'>Entrar</button>
                </Link>
            </div>
        </div>
    </section>
    </>
    );
}

export default Home