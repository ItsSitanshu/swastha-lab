import axios from 'axios';

const fetchDoctor: any = async (uid: string, supabase: any, setDoctor: (data: any) => void) => {
  
  try {
    const { data, error } = await supabase
      .from("doctor")
      .select("*")
      .eq("id", uid)
      .single(); 

    if (error) {
      console.error("Error fetching doctor profile picture:", error.message);
    } else {
      setDoctor(data);
    }
  } catch (err: any) {
    console.error("Error fetching doctor profile picture:", err.message);
  }
};

const fetchPatient: any = async (uid: string, supabase: any, setPatient: (data: any) => void) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", uid)
      .single(); 

    if (error) {
      console.error("Error fetching doctor profile picture:", error.message);
    } else {
      setPatient(data);
    }
  } catch (err: any) {
    console.error("Error fetching doctor profile picture:", err.message);
  }
};

const rawLLM = async (query: string, history: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/rllm', {
      history: history,
      query: query,
    });

    return response.data;
  } catch (error) {
    return { "error" : error }
  }
};

function getTokenCount(text: string): number {
  return text.split(/\s+/).length;
}

function trimToMaxTokens(text: string, maxTokens: number): string {
  const words = text.split(/\s+/);
  const trimmedWords = words.slice(0, maxTokens);
  return trimmedWords.join(' ');
}

export { rawLLM, getTokenCount, trimToMaxTokens, 
  fetchDoctor, fetchPatient };