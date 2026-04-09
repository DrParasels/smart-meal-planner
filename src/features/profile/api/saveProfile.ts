import { Profile } from "@/entities/profile/model/types";

export const saveProfile = async (profile: Profile) => {
    const res = await fetch('/api/profile', {
        method: "POST",
        body: JSON.stringify({
            name: profile.name,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            gender: profile.gender,
            activityLevel: profile.activityLevel,
            goal: profile.goal,
        })
    })

    if (!res.ok) {
        throw new Error('Ошибка при сохранении профиля');
    }

    return res.json();
}

export const getProfile = async () => {
    try {
        const res = await fetch('/api/profile', {
            method: "GET",
        })
        if (!res.ok) {
            throw new Error('Ошибка запроса');
        }
        const data: Profile = await res.json();
        return data
    } catch (error) {
        console.error(error)
        return null
    }

}