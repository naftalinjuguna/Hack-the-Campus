package com.campusdinga.lecture;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LectureService {

    private final LectureRepository lectureRepository;

    public LectureService(LectureRepository lectureRepository) {
        this.lectureRepository = lectureRepository;
    }

    public List<Lecture> getAllLectures() {
        return lectureRepository.findAll();
    }

    public Optional<Lecture> getLectureById(Long id) {
        return lectureRepository.findById(id);
    }

    public List<Lecture> searchLectures(String query, String day) {
        if ((query == null || query.isBlank()) && (day == null || day.isBlank())) {
            return lectureRepository.findAll();
        }
        return lectureRepository.filterLectures(query, day);
    }

    public Optional<Lecture> getUpcomingLecture() {
        List<Lecture> all = lectureRepository.findAll();
        return all.isEmpty() ? Optional.empty() : Optional.of(all.get(0));
    }

    public Lecture saveLecture(Lecture lecture) {
        return lectureRepository.save(lecture);
    }

    public void deleteLecture(Long id) {
        lectureRepository.deleteById(id);
    }
}
