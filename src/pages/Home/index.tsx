import background from '../../assets/imgs/background.png'

function Home() {
    return (
    <>
    <section className="h-[100vh] flex justify-center items-center" style={{ backgroundImage: `url(${background})` }}>
        <div className='bg-black opacity-80 flex flex-col items-center justify-center gap-10 p-4 m-5 md:m-5 h-6/10 w-8/10 rounded-3xl'>
            <h1 className='font-bold text-center text-5xl sm:text-6xl lg:text-8xl'>Seu próximo filme começa aqui</h1>
            <div className='flex flex-col sm:flex-row gap-4 '>
                <button className='font-bold border-[1px] py-3 px-8 rounded-[10px] w-35'>Cadastrar</button>
                <button className='font-bold py-3 px-8 rounded-[10px] bg-purple-600 w-35'>Entrar</button>
            </div>
        </div>
    </section>
    </>
    );
}

export default Home