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

export { fetchDoctor };