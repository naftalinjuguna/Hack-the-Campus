package com.campusdinga.bookmark;

import com.campusdinga.location.Location;
import com.campusdinga.location.LocationRepository;
import com.campusdinga.user.User;
import com.campusdinga.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkRepository bookmarkRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    public BookmarkController(BookmarkRepository bookmarkRepository,
                              LocationRepository locationRepository,
                              UserRepository userRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return userRepository.findByUsername(auth.getName()).orElse(null);
        }
        return userRepository.findByUsername("brian").orElse(null);
    }

    @GetMapping
    public ResponseEntity<List<Bookmark>> getBookmarks() {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.ok(bookmarkRepository.findAll());
        }
        return ResponseEntity.ok(bookmarkRepository.findByUserId(user.getId()));
    }

    @PostMapping("/{locationId}")
    public ResponseEntity<Bookmark> addBookmark(@PathVariable Long locationId) {
        User user = getCurrentUser();
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + locationId));

        Long userId = user != null ? user.getId() : 1L;
        if (user != null && bookmarkRepository.existsByUserIdAndLocationId(userId, locationId)) {
            return ResponseEntity.ok(bookmarkRepository.findByUserIdAndLocationId(userId, locationId).get());
        }

        Bookmark bookmark = new Bookmark(user, location);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookmarkRepository.save(bookmark));
    }

    @DeleteMapping("/{locationId}")
    @Transactional
    public ResponseEntity<Void> removeBookmark(@PathVariable Long locationId) {
        User user = getCurrentUser();
        Long userId = user != null ? user.getId() : 1L;
        bookmarkRepository.deleteByUserIdAndLocationId(userId, locationId);
        return ResponseEntity.noContent().build();
    }
}
