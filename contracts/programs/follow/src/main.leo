// AnoneX Follow Module
// Anonymous follow/subscription system
// Users can follow others by their pseudonym without revealing identity

program anonex_follow.aleo {
    // Private record proving a follow relationship
    record FollowRecord {
        owner: address,           // The follower
        following_hash: field,    // Hash of the address being followed
        timestamp: u64
    }

    // Public mapping: user_hash => follower count
    mapping follower_counts: field => u64;

    // Public mapping: user_hash => following count
    mapping following_counts: field => u64;

    // Mapping to track follow relationships (hash of follower+following => bool)
    mapping follows: field => bool;

    // Hash an address for privacy
    inline hash_address(addr: address) -> field {
        return BHP256::hash_to_field(addr);
    }

    // Generate unique follow relationship key
    inline get_follow_key(follower: address, following_hash: field) -> field {
        let follower_hash: field = hash_address(follower);
        return BHP256::hash_to_field(follower_hash + following_hash);
    }

    // Follow a user by their pseudonym hash
    async transition follow_user(
        target_user_hash: field,
        timestamp: u64
    ) -> (FollowRecord, Future) {
        // Create private follow record
        let record: FollowRecord = FollowRecord {
            owner: self.caller,
            following_hash: target_user_hash,
            timestamp: timestamp
        };

        // Generate follow key
        let follow_key: field = get_follow_key(self.caller, target_user_hash);
        let follower_hash: field = hash_address(self.caller);

        // Finalize on-chain
        let f: Future = finalize_follow_user(follow_key, follower_hash, target_user_hash);

        return (record, f);
    }

    async function finalize_follow_user(
        follow_key: field,
        follower_hash: field,
        target_hash: field
    ) {
        // Check if not already following
        let already_following: bool = Mapping::get_or_use(follows, follow_key, false);
        assert(!already_following);

        // Mark as following
        Mapping::set(follows, follow_key, true);

        // Increment follower count for target
        let target_followers: u64 = Mapping::get_or_use(follower_counts, target_hash, 0u64);
        Mapping::set(follower_counts, target_hash, target_followers + 1u64);

        // Increment following count for follower
        let follower_following: u64 = Mapping::get_or_use(following_counts, follower_hash, 0u64);
        Mapping::set(following_counts, follower_hash, follower_following + 1u64);
    }

    // Unfollow a user (requires the follow record)
    async transition unfollow_user(
        record: FollowRecord
    ) -> Future {
        // Verify ownership
        assert_eq(record.owner, self.caller);

        // Generate follow key
        let follow_key: field = get_follow_key(self.caller, record.following_hash);
        let follower_hash: field = hash_address(self.caller);

        // Finalize on-chain
        return finalize_unfollow_user(follow_key, follower_hash, record.following_hash);
    }

    async function finalize_unfollow_user(
        follow_key: field,
        follower_hash: field,
        target_hash: field
    ) {
        // Verify was following
        let was_following: bool = Mapping::get_or_use(follows, follow_key, false);
        assert(was_following);

        // Remove follow relationship
        Mapping::set(follows, follow_key, false);

        // Decrement follower count for target
        let target_followers: u64 = Mapping::get_or_use(follower_counts, target_hash, 0u64);
        if target_followers > 0u64 {
            Mapping::set(follower_counts, target_hash, target_followers - 1u64);
        }

        // Decrement following count for follower
        let follower_following: u64 = Mapping::get_or_use(following_counts, follower_hash, 0u64);
        if follower_following > 0u64 {
            Mapping::set(following_counts, follower_hash, follower_following - 1u64);
        }
    }

    // Get the caller's pseudonym hash (for sharing)
    transition get_my_pseudonym() -> field {
        return hash_address(self.caller);
    }
}
