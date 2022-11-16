import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import Loading from "../../components/Loading";
import Nav from "../../components/Nav";
import { getEvent, postCode, postPhone } from "../../api";
import { EventType, VisitorType } from "../../types";

const LOGO_MAPS_BUCKET = process.env.REACT_APP_LOGO_MAPS_BUCKET || "";

function App() {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<EventType>({} as EventType);
  const [phone, setPhone] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [visitor, setVisitor] = useState<VisitorType>();
  const [final, setFinal] = useState(false);
  const [error, setError] = useState(false);

  function normalizePhone(value: string) {
    setError(false);
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, "");
    const cvLength = currentValue.length;
    if (cvLength < 3) return currentValue;
    if (cvLength < 7)
      return `(${currentValue.slice(0, 2)}) ${currentValue.slice(2)}`;
    return `(${currentValue.slice(0, 2)}) ${currentValue.slice(
      2,
      7
    )}-${currentValue.slice(7, 11)}`;
  }

  function handleChangePhone(value: string) {
    setPhone(normalizePhone(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    if (!phone || phone.length < 15) {
      setError(true);
      setLoading(false);
      return;
    }
    try {
      const res = await postPhone(
        params.id as string,
        `+55${phone.replace(/\D/g, "")}`
      );
      if (res && res.id) {
        setVisitor(res);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  }

  async function handleSubmitCode(e: FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    if (!code || code.length < 6 || +code !== +(visitor?.code || 0)) {
      setError(true);
      setLoading(false);
      return;
    }
    try {
      const res = await postCode(
        visitor?.id || "",
        params?.id || "",
        visitor?.phone || "",
        +code
      );
      if (res && res.id) {
        setFinal(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  }

  function isDisabled() {
    if (phone.length < 15) return true;
    return false;
  }

  function isCodeDisabled() {
    if (code.length < 6) return true;
    return false;
  }

  const handleEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await getEvent(id);
				console.log(res)
        if (!res.eventID) navigate("/");
        setEvent(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        navigate("/");
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (params.id) handleEvent(params.id);
    else navigate("/");
  }, [handleEvent, navigate, params.id]);

  function renderPhone() {
    return (
      <>
        <h2 className="text-2xl text-center">Número do Celular</h2>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-full flex justify-end items-center relative"
        >
          <input
            value={phone || ""}
            onChange={(e) => handleChangePhone(e.target.value)}
            type="tel"
            className={`w-full p-3 text-xl font-bold bg-white bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:border-amber-500 focus:outline-none ${
              error ? "border-red-500" : "border-amber-300"
            }`}
          />
          <button
            type="submit"
            className="absolute right-2"
            disabled={isDisabled()}
          >
            <i
              className={`bx bxs-phone-outgoing  text-4xl ${
                error ? "text-red-500" : "text-secondary"
              }`}
            />
          </button>
        </form>
        {event.gift > 0 && event.giftDescription ? (
          <ReactMarkdown className="text-base text-justify">{event?.giftDescription}</ReactMarkdown>
        ) : null}
      </>
    );
  }

  function renderCode() {
    return (
      <>
        <h2 className="text-2xl text-center">Código de Verificação</h2>
        <form
          onSubmit={(e) => handleSubmitCode(e)}
          className="w-full flex justify-end items-center relative"
        >
          <input
            value={code || ""}
            onChange={(e) => setCode(e.target.value)}
            type="number"
            className={`w-full p-3 text-xl font-bold bg-white bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:border-amber-500 focus:outline-none ${
              error ? "border-red-500" : "border-amber-300"
            }`}
          />
          <button
            type="submit"
            className="absolute right-2"
            disabled={isCodeDisabled()}
          >
            <i
              className={`bx bxs-right-top-arrow-circle text-4xl ${
                error ? "text-red-500" : "text-secondary"
              }`}
            />
          </button>
        </form>
        <p className="text-xl text-center">
          {/* Participe de nossa pesquisa ao final do evento e concora a um kit cervejeiro! */}
          Você recebeu seu código por SMS no número cadastrado.
        </p>
      </>
    );
  }

  function renderFinal() {
    return (
      <>
        <h2 className="text-2xl text-center">
          Obrigado pela sua participação!
        </h2>
        <p className="text-xl text-center">
          Retire seu copo gratuitamente em um dos pontos identificados.
        </p>
        <p className="text-xl text-center">
          Participe de nossa pesquisa ao final do evento e concora a um kit
          cervejeiro!
        </p>
      </>
    );
  }

  return (
    <>
      <Nav eventID={params.id} />
      <div className="h-screen flex flex-row justify-center items-center">
        {loading && <Loading />}
        {!loading && event && (
          <div className="bg-white w-full mx-4 sm:w-10/12 md:w-6/12 sm:mx-0 p-8 sm:p-8 flex flex-col justify-center items-center gap-4 rounded-lg shadow-lg">
            {event.logo && (
              <img
                alt="logo"
                className="object-scale-down w-8/12 rounded-md"
                src={`https://${LOGO_MAPS_BUCKET}.s3.amazonaws.com${event.logo}`}
              />
            )}
            <h1 className="font-bold text-2xl text-center">{event.name}</h1>
            {!visitor && !final && renderPhone()}
            {visitor && !final && renderCode()}
            {visitor && final && renderFinal()}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
